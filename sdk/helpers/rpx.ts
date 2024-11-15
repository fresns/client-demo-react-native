/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

// Get device width
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

// Define the width of the design as 750
const DESIGN_WIDTH = 750;

// Conversion function: converts the dimensions of the design to actual dimensions
export const rpx = (size: number) => (width / DESIGN_WIDTH) * size;
