import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EncadrementEntity } from "./encadrement.entity";
import { TeamEntity } from "./team.entity";
import { ThemeDocumentEntity } from "./theme.document.entity";

@Entity('theme')
export class ThemeEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    title:string;

    @Column()
    descriptioN:string;
    //relations
    @OneToMany(type=>ThemeDocumentEntity,themeDocument=>themeDocument.theme)
    documents:ThemeDocumentEntity[];

    @OneToMany(type=>TeamEntity,team=>team.givenTheme)
    teams:TeamEntity[];

    @OneToMany(type=>EncadrementEntity,encadrement=>encadrement.theme)
    encadrement:EncadrementEntity[];



}