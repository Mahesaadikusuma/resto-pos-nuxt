<script setup lang="ts">
import BannerServerError from "../Banner/BannerServerError.vue";
import * as z from "zod";

const toast = useToast();
const { accessToken } = await useAuthToken();
const isLoading = ref(false);
const fieldErrors = ref<Record<string, string[]>>({})
const serverError = ref<string | null>(null)

const props = defineProps({
  permission: {
    type: Object as () => IPermission,
    required: true,
  },
});

const emit = defineEmits<{
  close: [boolean | object];
}>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const permissionSchema = z.strictObject({
  name: z
    .string()
    .min(3, "Minimal 3 karakter")
    .max(255, "Maximal 255 karakter"),
});
type PermissionSchema = z.output<typeof permissionSchema>;

// Isi formState dari props langsung, tidak perlu fetch ulang
const formState = reactive<PermissionSchema>({
  name: props.permission.name,
});

// Sync formState setiap kali props.permission berubah
watch(
  () => props.permission,
  (newPermission) => {
    formState.name = newPermission.name
    // Reset error saat ganti permission
    fieldErrors.value = {}
    serverError.value = null
  },
)

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    // Reset error sebelum submit
    fieldErrors.value = {}
    serverError.value = null

    const response = await permissionService.updatePermission(
      props.permission.id,
      { name: formState.name },
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

    serverError.value =
      err?.data?.message || err?.message || "Gagal Update Permission.";

    toast.add({
      title: "Gagal Update Permission",
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
    :item-id="props.permission.id"
    :item-name="props.permission.name"
    title="Edit Permission"
    :description="`Edit permission ${props.permission.name}.`"
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

      <UFormField label="Nama Permission" name="name">
        <UInput
          v-model="formState.name"
          :placeholder="props.permission.name"
          class="w-full"
        />
      </UFormField>
    </div>
  </ViewModalForm>
</template>