import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DocumentTypeEntity } from "./document-types.entity";
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
    minMembersInTeam:number;

    @Column({
        default:6
    })
    maxMembersInTeam:number;

    @Column({
        default:4
        
    })
    
    maxTeamForTheme:number

    @Column({
        default:3
        
    })
    minThemesToAssignThemesToTeams:number


    

    @Column({
        default:false
    })
    
    wishListSent:boolean;

    @Column({
        default:false
    })
    allTeamsValidated:boolean

    @Column({
        default:false
    })
    themesAssignedToTeams:boolean

    //relations

    @OneToMany(type=>TeamEntity,team=>team.promotion)
    teams:TeamEntity[];

    @OneToMany(type=>StudentEntity,student=>student.promotion)
    students:StudentEntity[];

    @OneToMany(type=>ThemeEntity,theme=>theme.promotion)
    themes:ThemeEntity[];

    @OneToMany(type=>DocumentTypeEntity,doctp=>doctp.promotion)
    documentTypes:DocumentTypeEntity[];




    
}


