import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CommitDocumentEntity } from "./commit.document.entity";
import { PromotionEntity } from "./promotion.entity";
import { TeamDocumentEntity } from "./team.document.entity";



@Entity('document_type')
export class DocumentTypeEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    
    //relation
    @ManyToOne(type=>PromotionEntity,promotion=>promotion.documentTypes)
    promotion:PromotionEntity;

    @ManyToOne(type=>CommitDocumentEntity,cmd=>cmd.type)
    commitsDocs:CommitDocumentEntity[];

    @ManyToOne(type=>TeamDocumentEntity,tmd=>tmd.type)
    teamDocs:TeamDocumentEntity[];

   
}