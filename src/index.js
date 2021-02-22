import {prepareObjFileUploading} from "./utils";
import {
    createBlackImage,
    createGradientImage,
    createRedImage,
    createStarImages,
    createBunnyImages,
    createWhiteImage
} from "./lab1";


createBlackImage();

createWhiteImage();

createRedImage();

createGradientImage();

createStarImages();

prepareObjFileUploading(createBunnyImages);
