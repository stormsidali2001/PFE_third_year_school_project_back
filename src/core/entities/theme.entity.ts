import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EncadrementEntity } from "./encadrement.entity";
import { EntrepriseEntity } from "./entreprise.entity";
import { PromotionEntity } from "./promotion.entity";
import { TeacherEntity } from "./teacher.entity";
import { TeamEntity } from "./team.entity";
import { ThemeDocumentEntity } from "./theme.document.entity";

@Entity('theme')
export class ThemeEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    title:string;

    @Column()
    description:string;

    @Column({
        default:false,
    })
    validated:boolean;

    //relations
    @OneToMany(type=>ThemeDocumentEntity,themeDocument=>themeDocument.theme)
    documents:ThemeDocumentEntity[];


    @OneToMany(type=>TeamEntity,team=>team.givenTheme)
    teams:TeamEntity[];

    @OneToMany(type=>EncadrementEntity,encadrement=>encadrement.theme)
    encadrement:EncadrementEntity[];

    @ManyToOne(type=>TeacherEntity,teacher=>teacher.suggestedThemes)
    suggestedByTeacher:TeacherEntity;

    @ManyToOne(type=>EntrepriseEntity,entreprise=>entreprise.suggestedThemes)
    suggestedByEntreprise:EntrepriseEntity;

    @ManyToOne(type=>PromotionEntity,promotion=>promotion.themes)
    promotion:PromotionEntity;



}