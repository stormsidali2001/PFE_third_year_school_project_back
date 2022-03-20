import {  Entity, ManyToOne } from "typeorm";
import { DoucmentData } from "../abstracts/document.data";
import { AnnouncementEntity } from "./announcement.entity";

@Entity('announcement_document')
export class AnnouncementDocumentEntity extends DoucmentData{
    //relations
    @ManyToOne(type=>AnnouncementEntity,announcement=>announcement.documents)
    announcement:AnnouncementEntity;
 
   
}