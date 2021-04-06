/**
 * In order to use async/await without "regeneratorRuntime is not defined" error
 * See https://flaviocopes.com/parcel-regeneratorruntime-not-defined/
 */
import "regenerator-runtime/runtime";

import {initTabs} from "./utils";

initTabs(2);

// TODO change displacement controls into imageSize control (just one control, images are square)
