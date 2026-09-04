<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import BannerServerError from "~/components/view/Banner/BannerServerError.vue";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
  name: "setting-admin-permission-create",
});

useHead({
  title: "Create Permission",
});
const { accessToken } = await useAuthToken();
const fieldErrors = ref<Record<string, string[]>>({})
const serverError = ref<string | null>(null)

const permissionSchema = z.strictObject({
  name: z
    .string()
    .min(3, "Minimal 3 karakter")
    .max(255, "Maximal 100 karakter"),
});
type PermissionSchema = z.output<typeof permissionSchema>;
const toast = useToast();

const permissionState = reactive<PermissionSchema>({
  name: "",
});

const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<PermissionSchema>) {
  fieldErrors.value = {}
  serverError.value = null

  try {
    isLoading.value = true;
    const response = await permissionService.createPermission(event.data, accessToken || "",
    );

    toast.add({
      title: "Success",
      description: response?.message || "Permission berhasil ditambahkan",
      color: "success",
    });

    await navigateTo("/dashboard/admin/setting/permission");
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
    const validationErrors = err?.data?.errors;
    
    if (validationErrors) {
      fieldErrors.value = validationErrors
    }

    serverError.value = err?.data?.message || err?.message || "Gagal membuat permission.";
    toast.add({
      title: "Gagal membuat permission",
      description: serverError.value,
      color: "error",
    });
 
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UContainer>
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-5 md:mb-8"
    >
      <div class="">
        <div class="flex items-center gap-2 mb-5">
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            color="neutral"
            :to="{ name: 'setting-admin-permission' }"
          >
            Back to List Permission
          </UButton>
        </div>
      </div>
    </div>
     <BannerServerError
        :server-error="serverError"
        :field-errors="fieldErrors"
      />
      <UCard variant="soft" title="Buat Permission" class="">
      <div class="">
        <!-- Tambahkan :errors untuk menampilkan error dari Laravel -->
        <UForm
          :schema="permissionSchema"
          :state="permissionState"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Name" name="name" description="">
            <UInput
              v-model="permissionState.name"
              placeholder="Example-create"
              class="w-full"
              :disabled="isLoading"
            />
          </UFormField>

          <!-- Tambahkan properti loading agar tombol berputar saat proses -->
          <UButton
            type="submit"
            class="w-full justify-center"
            :loading="isLoading"
          >
            Submit
          </UButton>
        </UForm>
      </div>
    </UCard>
  </UContainer>
</template>
