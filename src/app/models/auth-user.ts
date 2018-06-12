import { UserSummary } from './user-summary';
import { Role } from './role';

export class AuthUser {
	summary: UserSummary;
	role: Role;
	permissions: Array<string> = [];
}