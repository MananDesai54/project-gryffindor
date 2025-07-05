import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FilterType } from './filters/filter.type';

export class FilterDto {
  @IsEnum(FilterType)
  @IsNotEmpty()
  filterType: FilterType;

  @ArrayNotEmpty()
  value: any[];

  @IsString()
  @IsNotEmpty()
  field: string;
}

export class PageInfoDto {
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  size: number;
}

export class SearchRequestDto {
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => FilterDto)
  filters?: FilterDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PageInfoDto)
  pageInfo?: PageInfoDto;
}
