import Eris from 'eris';

declare module 'eris' {
	interface User {
		/**
		 * @description Get the user's tag
		 * @author acayrin
		 * @returns {*}  {string}
		 * @memberof User
		 */
		tag: () => string;
	}
}

// user
Eris.User.prototype.tag = function (this: Eris.User) {
	return `${this.username}#${this.discriminator}`;
};
