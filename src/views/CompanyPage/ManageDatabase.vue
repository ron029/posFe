<template>
    <div v-if="showDialog">
        <v-dialog
            v-model="showDialog"
            width="650px"
        >
            <v-card style="padding-top: 20px;">
                <v-card-subtitle>For safety, please backup before restoring.</v-card-subtitle>
                <v-card-text class="container">
                    <v-btn
                        class="backup-btn"
                        color="primary"
                        :loading="loading.backup"
                        :disabled="loading.backup || !isUserCanBackUpDatabase"
                        @click="handleBackup"
                        height="240"
                        width="240"
                    >
                        <div class="d-flex flex-column align-center">
                            <v-icon size="150">mdi-database-export-outline</v-icon>
                            <span class="text-h5 font-weight-bold mt-2">BACKUP</span>
                        </div>
                    </v-btn>

                    <v-btn
                        class="restore-btn"
                        color="secondary"
                        :loading="loading.restore"
                        :disabled="!hasExistingBackup || loading.restore || !isUserCanRestoreDatabase"
                        @click="handleRestore"
                        height="240"
                        width="240"
                    >
                        <div class="d-flex flex-column align-center">
                            <v-icon size="150">mdi-database-refresh-outline</v-icon>
                            <span class="text-h5 font-weight-bold mt-2">Restore</span>
                        </div>
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="showPromptRestore"
            width="600px"
        >
            <v-card>
                <v-form
                    ref="form"
                    v-model="isFormValid"
                    style="padding: 20px;"
                >
                    <v-file-input
                        v-model="sqlFile"
                        label="Select SQL File"
                        :rules="fileRules"
                        accept=".sql"
                        outlined
                        prepend-icon="mdi-database"
                        :show-size="true"
                        hint="Select a SQL file for database restoration"
                        persistent-hint
                        color="orange"
                    ></v-file-input>
                    <p style="text-align: center;">
                        <v-btn
                            color="orange"
                            :disabled="!isFormValid || isLoading"
                            :loading="isLoading"
                            @click="uploadSqlFile"
                            class="mt-4"
                        >Restore Database</v-btn>
                    </p>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data: ()=>({
        hasExistingBackup: false,
        sqlFile: null,
        isFormValid: false,
        isLoading: false,
        message: null,
        success: false,
        fileRules: [
            v => !!v || 'SQL file is required',
            v => !v || v.name.endsWith('.sql') || 'File must be a SQL file'
        ],

        showPromptRestore: false,
        filePath: null,
        selectedFile: null,
        loading: {
            backup: false,
            restore: false
        }
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['backupData', 'restoreData', 'findUserRolePermissionData']),
        isUserCanRestoreDatabase() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'restore:0')
            return false
        },
        isUserCanBackUpDatabase() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'backup:0')
            return false
        },
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('closeDialog')
            }
        }
    },
    watch: {
        backupData(newVal) {
            this.loading.backup = false
            if (newVal.STATUS === 200) {
                this.hasExistingBackup = true
                alert('Backup completed successfully! The SQL file has been saved to Documents > POS_DATABASE_BACKUP.')
            } else {
                alert('Backup failed! Please check your storage space or permissions and try again.')
            }
        }
    },
    methods: {
        ...mapActions(['backup', 'restore', 'getCsrfToken', 'backup']),
        async uploadSqlFile() {
            if (!this.$refs.form.validate() || !this.sqlFile) {
                return;
            }

            this.isLoading = true;
            this.message = null;

            try {
                // Create FormData object
                const formData = new FormData();

                // Append the file with the field name 'sqlFile'
                formData.append('sqlFile', this.sqlFile);

                // Get CSRF token first
                const csrfToken = await this.getCsrfToken();
                console.log('csrfToken: ', csrfToken)

                // Make the API request with the CSRF token included
                const response = await fetch(`${process.env.VUE_APP_API}/manage-db/restore`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        // Include CSRF token in the header
                        'X-CSRF-TOKEN': csrfToken.common['X-CSRF-TOKEN'],
                        // Don't set Content-Type for FormData
                    },
                    // Include credentials to send cookies
                    credentials: 'include'
                });

                const result = await response.json();

                if (response.ok) {
                    this.success = true;
                    this.message = 'Database restored successfully!';
                    this.$refs.form.reset(); // Clear the form after success
                } else {
                    this.success = false;
                    this.message = result.MESSAGE || 'Failed to restore database';
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                this.success = false;
                this.message = 'Network error while uploading file';
            } finally {
                this.isLoading = false;
            }
            alert(this.message)
            setTimeout(() => {
                this.message = null
            }, 1000)
            this.showPromptRestore = false
        },
        handleFileChange(file) {
            console.log('file: ', file)
            if (file) {
                // Get the file path from the file object
                // Note: Due to security restrictions, browsers don't provide the full file path
                // This will contain only the filename
                this.filePath = file.name;

                // For demonstration purposes, we're just using the filename
                console.log("SQL file selected:", this.filePath);
            } else {
                this.filePath = null;
            }
        },
        handleBackup() {
            this.loading.backup = true
            alert('After successful backup, the SQL file will save to Documents > POS_DATABASE_BACKUP')
            setTimeout(() => {
                this.backup()
            }, 1000)
        },
        handleRestore() {
            this.showPromptRestore = true
            // this.restore()
        }
    }
}
</script>

<style scoped>
.container {
    height: 360px;
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center;
    gap: 50px;
}
    .backup-btn, .restore-btn {
        border-radius: 12%;
    }

    .backup-btn {
        background: linear-gradient(45deg, #007bff, #00c6ff);
    }

    .restore-btn {
        background: linear-gradient(45deg, #ff7b00, #ffcc00);
    }
</style>
