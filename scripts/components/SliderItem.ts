import SliderItemDesign from 'generated/my-components/SliderItem';

export default class SliderItem extends SliderItemDesign {
	pageName?: string | undefined;
	constructor(props?: any, pageName?: string) {
		// Initalizes super class for this scope
		super(props);
		this.pageName = pageName;
	}
}
