import authClient from './baseapi/AuthorAPI';

const storageFiles = '/storage/files';

const FileUploadAPI = {
    /**
     * Uploads a file to the server.
     * @param {FormData} form - The form data containing the file to be uploaded.
     * @returns {Promise} - A promise that resolves to the server's response.
     */
    uploadFile: (form) => {

        // console.log(Array.from(form.entries()));

        authClient
            .post(`${storageFiles}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is specified
                },
            })
            .then((response) => response.data)
    },

};

export default FileUploadAPI;
