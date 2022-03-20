import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AnnouncementDocumentEntity } from "./announcement.document.entity";
import { TeamEntity } from "./team.entity";

@Entity('annoncement')
export class AnnouncementEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    title:string;

    @Column()
    description:string;

    //relations
    @OneToMany(type=>AnnouncementDocumentEntity,announcementDoc=>announcementDoc.announcement)
    documents:AnnouncementDocumentEntity[];

    @ManyToOne(type=>TeamEntity,team=>team.announcements)
    team:TeamEntity;
}