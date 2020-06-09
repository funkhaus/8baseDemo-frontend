<template lang="html">
  <button :class="classes" @click="openFilePicker">
    <slot />
  </button>
</template>

<script>
// Helpers
import * as Filestack from "filestack-js";

// GQL
import FileUploadInfo from "~/gql/queries/FileUploadInfo";

export default {
  props: {
    accept: {
      type: Array,
      default: undefined
    },
    maxFiles: {
      type: Number,
      default: 1
    },
    maxFileSize: {
      type: Number,
      default: 100 * 1024 * 1024 // 100mb
    },
    sources: {
      type: Array,
      default: () => ["local_file_system", "url", "dropbox", "googledrive"]
    }
  },
  data() {
    return {
      fileReferences: [],
      isLoading: false,
      uploadInfo: undefined
    };
  },
  computed: {
    classes() {
      return ["button-upload", { "is-loading": this.isLoading }];
    },
    /**
     * Creates FileStack client using upload info (fetched from 8Base).
     */
    client() {
      if (this.uploadInfo != undefined) {
        const { apiKey, signature, policy } = this.uploadInfo;
        /* Return initialized filestack client */
        return Filestack.init(apiKey, {
          security: {
            signature,
            policy
          }
        });
      }
    }
  },

  methods: {
    /**
     * On picker open.
     */
    onOpen() {
      this.clearFiles();
    },
    /**
     * Clear the old uploaded files from memory.
     */
    clearFiles() {
      this.fileReferences = [];
    },
    /**
     * On picker close.
     */
    onClose() {
      this.isLoading = false;
    },
    /**
     * Called when all files have been uploaded.
     */
    onDone() {
      this.$emit("uploaded-all", this.fileReferences);
    },
    /**
     * Unobserves passed arrays / objects.
     */
    unobserve(object) {
      return JSON.parse(JSON.stringify(object));
    },
    /**
     * Stores the file reference after upload.
     */
    storeRef(file) {
      /* Unpack requred fields from response */
      const { filename, handle, mimetype, size, url } = file;

      const newFile = {
        filename,
        fileId: handle,
        //downloadUrl: TODO Not sure how to get this from the shit Filestack API?
        meta: {
          mimetype,
          size,
          url
        }
      };

      this.fileReferences = [...this.fileReferences, { ...newFile }];
      this.$emit("uploaded-file", newFile);
    },
    /**
     * Validate the file size and other parameters.
     */
    fileValidations(file) {
      // If you throw any error in this function it will reject the file selection.
      // The error message will be displayed to the user as an alert.
      if (file.size > 1024 * 1024 * this.maxFileSize) {
        throw new Error(
          `File too big, select something smaller than ${this.maxFileSize}MB`
        );
      }
    },
    /**
     * Open the file picker.
     */
    async openFilePicker() {
      // Don't allow picker to be open twice
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      /**
       * Get the upload info for the asset as soon
       * as the component is created.
       */
      this.uploadInfo = await this.fetchFileUploadInfo();
      /**
       * Show filepicker is loading.
       */
      this.client
        // SEE https://filestack.github.io/filestack-js/interfaces/pickeroptions.html
        .picker({
          fromSources: this.unobserve(this.sources),
          maxFiles: this.maxFiles,
          /**
           * Storage info.
           */
          storeTo: {
            location: "s3",
            path: this.uploadInfo.path
          },
          /**
           * Allow transformations.
           */
          transformations: {
            circle: true,
            rotate: true,
            crop: false
          },
          /**
           * Callbacks.
           */
          onFileSelected: this.fileValidations,
          onFileUploadFinished: this.storeRef,
          onUploadDone: this.onDone,
          /**
           * FileReferences must be reset on each mount
           * to prevent duplicate uploads.
           */
          onClose: this.onClose,
          onOpen: this.onOpen,
          accept: this.accept
        })
        .open();
    },
    /**
     * Fetch the upload credentials for Filestack from 8Base.
     */
    async fetchFileUploadInfo() {
      try {
        const {
          data: { fileUploadInfo }
        } = await this.$apollo.mutate({
          mutation: FileUploadInfo
        });

        return fileUploadInfo;
      } catch (e) {
        console.log("Filestack fileUploadInfo error", e);
      }
    }
  }
};
</script>

<style lang="css" scoped></style>
