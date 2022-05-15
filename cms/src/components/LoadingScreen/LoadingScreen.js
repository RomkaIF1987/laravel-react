import { memo } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

function LoadingScreen() {
  return (
    <div
      id="npg-splash-screen"
      className="absolute bg-npg-3-alt-1 w-full h-full left-0 top-0 flex justify-center items-center"
    >
      <Backdrop classes={{ root: "bg-npg-2 bg-opacity-10" }} className="z-999" open>
        <CircularProgress className="fill-current text-npg-primary-color mt-320" />
      </Backdrop>
    </div>
  );
}

export default memo(LoadingScreen);
