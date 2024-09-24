import { Router } from "express";
import { auth } from "../middlewares/authenticate";
import { upload } from "../middlewares/upload";
import CdnController from "../controllers/cdn/index.ctrl";

class CdnRoutes {
  public router = Router();
  private controller = new CdnController();

  constructor() {
    this.router.post(
      "/upload-file",
      auth,
      upload.fields([
        {
          name: "attachment",
        },
      ]),
      this.controller.uploadFile,
    );
  }
}

export default new CdnRoutes().router;
