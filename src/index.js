import {prepareObjFileUploading} from "./utils";
import {
    createBlackImage,
    createGradientImage,
    createRedImage,
    createStarImages,
    createImagesOuttaObj,
    createWhiteImage
} from "./lab1";


createBlackImage();

createWhiteImage();

createRedImage();

createGradientImage();

createStarImages();

prepareObjFileUploading(createImagesOuttaObj);
