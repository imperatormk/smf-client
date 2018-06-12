export class User {
	_id: number = -1;
	username: string = "";
	email: string = "";
	gender: string = "";
	dateOfBirth: string = "";
	memberSince: string = "";
	
	constructor(user: User) {
    	for (var prop in user) {
        	this[prop] = user[prop];
        }
    }

	getGender() {
    	if (this.gender == 'x') return 'Non-binary';
    	if (this.gender == 'm') return 'Male';
    	if (this.gender == 'f') return 'Female';
    }
}