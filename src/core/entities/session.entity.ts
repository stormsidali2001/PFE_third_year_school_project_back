import { ISession } from "connect-typeorm";
import { Column, Entity, Index, PrimaryColumn } from "typeorm";
@Entity('session')
export class SessionEntity implements ISession {
  @Index()
  @Column("bigint")
  public expiredAt = Date.now();
 
  @PrimaryColumn("varchar", { length: 255 })
  public id = "";
 
  @Column("text")
  public json = "";
}