import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StudentEntity } from "./student.entity";
import { TeamEntity } from "./team.entity";
import { ThemeEntity } from "./theme.entity";


@Entity('promotion')
export class PromotionEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({
        unique:true
    })
    name:string;

    @Column({
        default:4
    })
    minTeam:number;

    @Column({
        default:6
    })
    maxTeam:number;

    //relations

    @OneToMany(type=>TeamEntity,team=>team.promotion)
    teams:TeamEntity[];

    @OneToMany(type=>StudentEntity,student=>student.promotion)
    students:StudentEntity[];

    @OneToMany(type=>ThemeEntity,theme=>theme.promotion)
    themes:ThemeEntity[];




    
}

