import { PartialType } from "@nestjs/swagger";
import { BatchesDto } from "./createBatches.dto";

export class UpdateBatchesDto extends PartialType(BatchesDto) {
}