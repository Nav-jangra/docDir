import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { HttpHelper } from "./http.service";

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [HttpHelper],
    exports: [HttpHelper],
})
export class UtilityModule { }


