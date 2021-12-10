import CitiesListViewItem from 'generated/my-components/CitiesListViewItem';
import CitySelectPageDesign from 'generated/pages/citySelectPage';
import cities from 'utils/cities';
import store from '../store/index'

export default class CitySelectPage extends CitySelectPageDesign {
    router: any;
    routeData: any;
	constructor() {
		super();
		// Overrides super.onShow method
		this.onShow = onShow.bind(this, this.onShow.bind(this));
		// Overrides super.onLoad method
		this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
	}
}

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(this: CitySelectPage, superOnShow: () => void) {
	superOnShow();
    this.searchView1.onTextChanged = (searchText) => {
        let firstLetterUppercased = searchText.charAt(0).toLocaleUpperCase('tr-TR') + searchText.slice(1);
        console.log('firstLetterUppercased', firstLetterUppercased)

        if (firstLetterUppercased && firstLetterUppercased.length > 0) {
            let foundCities = cities.filter(item => item.name.startsWith(firstLetterUppercased, 0))
            console.log('foundCities', foundCities)
            if (foundCities && foundCities.length > 0 && foundCities.length !== 81) {
                this.listView1.rowHeight = 40;
                this.listView1.itemCount = foundCities.length;
                this.listView1.onRowBind = (listViewItem: CitiesListViewItem, index: number) => {
                    listViewItem.lblListCityName.text = foundCities[index].name
                }
                this.listView1.refreshData();
                this.listView1.stopRefresh();
            }
        } else {
            this.listView1.itemCount = 0;
            this.listView1.refreshData();
        }
    }
    this.listView1.onRowSelected = (listViewItem: CitiesListViewItem, index: number) => {
        let selectedCity = cities.find(city => city.name === listViewItem.lblListCityName.text)
        console.log('selectedCIty', selectedCity)
        store.dispatch({
            type: "SET_CITY",
            payload: {
              city:{
                  name: selectedCity.name
              }
            }
          });
          this.router.goBack();

        
    }
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(this: CitySelectPage, superOnLoad: () => void) {
	superOnLoad();

}
