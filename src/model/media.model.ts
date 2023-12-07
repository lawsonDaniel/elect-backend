import {
  Model,
  Table,
  PrimaryKey,
  Column,
  DataType,
  AllowNull,
  Default,
  Index,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { UsersModel as User } from "./user.model"; // Assuming you have a User model

@Table({ timestamps: true, tableName: "media" })
export class MediaModel extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  link!: string;

  @Column(DataType.STRING)
  mediaType!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
  })
  user!: User;
}
