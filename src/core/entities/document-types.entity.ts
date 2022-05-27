import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PromotionEntity } from "./promotion.entity";



@Entity('document_type')
export class DocumentTypeEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    //relation
    @ManyToOne(type=>PromotionEntity,promotion=>promotion.documentTypes)
    promotion:PromotionEntity;
}