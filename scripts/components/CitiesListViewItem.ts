import CitiesListViewItemDesign from 'generated/my-components/CitiesListViewItem';

export default class CitiesListViewItem extends CitiesListViewItemDesign {
	pageName?: string | undefined;
	constructor(props?: any, pageName?: string) {
		// Initalizes super class for this scope
		super(props);
		this.pageName = pageName;
	}
}
