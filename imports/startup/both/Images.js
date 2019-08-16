import { FilesCollection } from 'meteor/ostrio:files';

const StoragePath = "/doc_storage";

const Images = new FilesCollection({
    collectionName: 'Images',
    storagePath: StoragePath
});

export { StoragePath };
export default Images;