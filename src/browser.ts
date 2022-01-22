export function hello(world = 'world'): string {
	return `Hello ${world}!`;
}

const attachPoint = document.body.querySelector('code');
if (attachPoint) {
	attachPoint.insertAdjacentHTML('beforeend', hello());
}
