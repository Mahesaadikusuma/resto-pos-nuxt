<script setup lang="ts">
import type { IUser } from "~/types/Auth";
import BannerServerError from "../Banner/BannerServerError.vue";

const toast = useToast();
const { getSession } = useAuth();
const session = await getSession();
const accessToken = (session?.user as { accessToken?: string })?.accessToken;
const isLoading = ref(false);
const fieldErrors = ref<Record<string, string[]>>({})
const serverError = ref<string | null>(null)

const props = defineProps({
  user: {
    type: Object as () => IUser,
    required: true,
  },
});

const emit = defineEmits<{
  close: [boolean | object];
}>();

const { roles, rolesStatus, onOpen } = await useRoleSelect();

// ganti value: String(role.name) jadi id jika gunakan id dan ubah di useRoleSelect
const userRoleOptions =
  props.user.roles?.map((role) => ({
    label: role.name,
    value: String(role.name),
  })) ?? [];

// Items untuk dropdown: gabung hasil fetch + role user, cukup 1 baris pakai filter
const roleItems = computed(() => [
  ...userRoleOptions,
  ...(roles.value ?? []).filter(
    (role) => !userRoleOptions.some((u) => u.value === role.value),
  ),
]);

const formState = reactive({
  name: props.user.name,
  email: props.user.email,
  roles: userRoleOptions.map((r) => r.value),
});

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    // Reset error sebelum submit
    fieldErrors.value = {}
    serverError.value = null

    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("email", formState.email);
    formState.roles.forEach((role, index) => {
      formData.append(`roles[${index}]`, role.toString());
    });

    const response = await userService.updateHakAkses(
      props.user.id,
      formData,
      accessToken || "",
    );

    if (response.success) {
      return emit("close", true);
    }
    
  } catch (error: unknown) {
    const err = error as {
      data?: {
        message?: string;
        success?: boolean;
        errors?: Record<string, string[]>;
      };
      message?: string;
      response?: { status?: number };
    };

    // Isi field errors per-field (simpan sebagai array)
    const validationErrors = err?.data?.errors;
    if (validationErrors) {
      fieldErrors.value = validationErrors
    }

    // Pesan umum di banner atas form
    serverError.value =
      err?.data?.message || err?.message || "Gagal Update Hak Akses.";

    toast.add({
      title: "Gagal Update Hak Akses",
      description: serverError.value,
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <ViewModalForm
    :item-id="props.user.id"
    :item-name="props.user.name"
    title="Ubah Hak Akses User"
    :description="`Ubah hak akses ${props.user.name}, pastikan Anda tidak salah mengubah hak akses.`"
    submit-icon="i-lucide-check-circle"
    submit-color="success"
    :loading="isLoading"
    @submit-form="handleSubmit"
    @close="(val: any) => emit('close', val)"
  >
    <div class="flex flex-col space-y-5">

      <!-- Banner error umum dari server -->
      <BannerServerError
        :server-error="serverError"
        :field-errors="fieldErrors"
      />

      <UFormField label="Nama Lengkap" name="name">
        <UInput
          v-model="formState.name"
          placeholder="Masukkan nama"
          class="w-full"
          disabled
        />
      </UFormField>

      <UFormField label="Email" name="email">
        <UInput
          v-model="formState.email"
          type="email"
          placeholder="email@contoh.com"
          class="w-full"
          disabled
        />
      </UFormField>

      <UFormField label="Role" name="roles" :error="fieldErrors.roles?.join(', ')">
        <USelect
          v-model="formState.roles"
          :items="roleItems"
          :loading="rolesStatus === 'pending'"
          multiple
          class="w-full"
          value-key="value"
          placeholder="Select Role"
          @update:open="onOpen"
        >
          <template #item-label="{ item }">
            {{ item.label }}
          </template>
        </USelect>
      </UFormField>
    </div>
  </ViewModalForm>
</template>
