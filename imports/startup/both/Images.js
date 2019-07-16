import { FilesCollection } from 'meteor/ostrio:files';

const StoragePath = Meteor.settings.STORAGE_PATH;

const Images = new FilesCollection({
    collectionName: 'Images',
    storagePath: StoragePath
});

export { StoragePath };
export default Images;