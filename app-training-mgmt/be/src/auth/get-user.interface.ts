import { Role } from 'src/core/enum/role.enum';
import { Employee } from 'src/employee/entities/employee.entity';

export interface IGetUser {
  username: Employee;
  role: Role;
  lastLoggedIn: Date;
}
