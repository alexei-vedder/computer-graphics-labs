/**
 * In order to use async/await without "regeneratorRuntime is not defined" error
 * See https://flaviocopes.com/parcel-regeneratorruntime-not-defined/
 */
import "regenerator-runtime/runtime";

import {initTabs} from "./utils";

initTabs(1);
