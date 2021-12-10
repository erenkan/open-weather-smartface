import Page2Design from 'generated/pages/page2';
import HeaderBarItem from '@smartface/native/ui/headerbaritem';
import touch from '@smartface/extension-utils/lib/touch';
import Image from '@smartface/native/ui/image';
import PageTitleLayout from 'components/PageTitleLayout';
import componentContextPatch from '@smartface/contx/lib/smartface/componentContextPatch';
import Color from '@smartface/native/ui/color';
import System from '@smartface/native/device/system';
import { getWeatherOneCall } from 'api/weatherRepository';
import ListViewItem1 from 'generated/my-components/ListViewItem1';
import View from '@smartface/native/ui/view';
import moment from 'moment'
import store from '../store/index'
export default class Page2 extends Page2Design {
    router: any;
    routeData: any;
    parentController: any;
    constructor() {
        super();
        // Overrides super.onShow method
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        // Overrides super.onLoad method
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        // touch.addPressEvent(this.btnSayHello, () => {
        //   alert('Hello World!');
        // });
   
    this.labelBackIcon.on(View.Events.Touch, () => {
       this.router.goBackto(-1)
    })
    }
    async getWeatherDetails() {
            this.lblCity.text = store.getState().city.name;
            const response = await getWeatherOneCall(store.getState().city.latitude, store.getState().city.longitude);
            if (response) {
                try {
                    this.listView1.rowHeight = 80;
                    this.listView1.itemCount = response.daily.length;
                    this.listView1.onRowBind = (listViewItem: ListViewItem1, index: number) => {
                        listViewItem.lblDayName.text = moment.unix(response.daily[index].dt).format('dddd')
                        listViewItem.lblDayTemp.text = Math.round(response.daily[index].temp.day).toString();
                        listViewItem.lblNightTemp.text = Math.round(response.daily[index].temp.night).toString();
                        listViewItem.imgDayIcon.loadFromUrl({
                            url: `https://openweathermap.org/img/wn/${response.daily[index].weather[0].icon}@2x.png`,
                        })
                    }
                    this.listView1.refreshData();

                } catch (error) {
                    console.error(error)
                }

            }

      
    }
}

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 */
function onShow(this: Page2, superOnShow: () => void) {
    superOnShow();
    this.headerBar.titleLayout.applyLayout();
    this.routeData && console.info(this.routeData.coords);
    if (store.getState().city.name && store.getState().city.name !== '') {
        this.getWeatherDetails()
    }
}

/**
 * @event onLoad
 * This event is called once when page is created.
 */
function onLoad(this: Page2, superOnLoad: () => void) {
    superOnLoad();
    let headerBar;
    this.headerBar.titleLayout = new PageTitleLayout();
    componentContextPatch(this.headerBar.titleLayout, 'titleLayout');
    if (System.OS === 'Android') {
        headerBar = this.headerBar;
        headerBar.setLeftItem(
            new HeaderBarItem({
                onPress: () => {
                    this.router.goBack();
                },
                image: Image.createFromFile('images://arrow_back.png'),
            }),
        );
    } else {
        headerBar = this.parentController.headerBar;
    }
    headerBar.itemColor = Color.WHITE;
}
