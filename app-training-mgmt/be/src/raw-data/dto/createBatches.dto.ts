import { ApiProperty } from "@nestjs/swagger";

export class BatchesDto {
    @ApiProperty()
    batchTitle: string;

    @ApiProperty()
    tech: string;

    @ApiProperty()
    startDate: any;

    @ApiProperty()
    endDate: any;

    @ApiProperty()
    trainingCoordinator: string;

    @ApiProperty()
    headTrainer: string;

    @ApiProperty()
    NoOfTrainees: number | null;

    @ApiProperty()
    NoSuccess: number | null ;

    @ApiProperty()
    NoFailed: number | null;

    @ApiProperty()
    status: string | null;
}