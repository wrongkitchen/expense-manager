import { FilesCollection } from 'meteor/ostrio:files';

const StoragePath = Meteor.settings.STORAGE_PATH;

const Images = new FilesCollection({
    collectionName: 'Images',
    storagePath: "/doc_storage"
});

export { StoragePath };
export default Images;