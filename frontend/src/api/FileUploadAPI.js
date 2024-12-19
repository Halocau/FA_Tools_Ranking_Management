import authClient from './baseapi/AuthorAPI';

const storageFiles = '/storage/files';

const FileUploadAPI = {
    /**
     * Uploads a file to the server.
     * @param {FormData} form - The form data containing the file to be uploaded.
     * @returns {Promise} - A promise that resolves to the server's response.
     */
    uploadFile: async (form) => {

        // console.log(Array.from(form.entries()));

        const response = await authClient
            .post(`${storageFiles}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is specified
                },
            });
        return response.data;
    },

    downloadFile: async (form) => {
        const response = await authClient
            .get(`${storageFiles}?fileName=${form.filename}&folder=${form.upload}`, { responseType: 'arraybuffer' });
        return response;
    }
};

export default FileUploadAPI;
