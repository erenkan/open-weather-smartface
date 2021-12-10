import Page1Design from 'generated/pages/page1';
import componentContextPatch from '@smartface/contx/lib/smartface/componentContextPatch';
import PageTitleLayout from 'components/PageTitleLayout';
import Application from '@smartface/native/application';
import System from '@smartface/native/device/system';
import Location from '@smartface/native/device/location';
import PermissionUtil from '@smartface/extension-utils/lib/permission';
import { getWeatherByCityName, getWeatherByLocation } from '../api/weatherRepository';
import { getLocation } from '@smartface/extension-utils/lib/location';
import View from '@smartface/native/ui/view';
import Color from '@smartface/native/ui/color';
import SliderItem from 'components/SliderItem'
import store from '../store/index'

const sliderItems = [{ title: '15 min ago', subTitle: 'Its raining' }, { title: '20 min ago', subTitle: 'Rain clouds incoming' }, { title: '30 min ago', subTitle: 'Its sunny here, be sure wear your hat' }];
export default class Page1 extends Page1Design {
    router: any;
    routeData: any;
    longitude: any;
    latitude: any;
    city: any;
    constructor() {
        super();
        let lat = String;
        let lon = String
        // Overrides super.onShow method
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        // Overrides super.onLoad method
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        this.labelCalendarIcon.on(View.Events.Touch, () => {
            this.router.push('/pages/page2', {
                coords: {
                    latitude: this.latitude,
                    longitude: this.longitude,
                    city: this.city
                }
            });
        })
        this.labelLocationIcon.on(View.Events.Touch, () => {
            this.router.push('/pages/citySelectPage');
        })
    }

    async getWeather(cityName: string) {
        this.toggleIndicatorVisibility(true);
        const response = await getWeatherByCityName(cityName);
        if (response) {
            console.log('weather responses', response);
            this.labelWeatherStatus.text = response.weather[0].description
            this.labelWindspeed.text = response.wind.speed
            this.labelHumidity.text = `${response.main.humidity}%`
            this.latitude = response.coord.lat;
            this.longitude = response.coord.lat;
            this.city = response.name;
            this.imageView1.loadFromUrl({
                url: `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`,
            })
            this.labelCity.text = response.name;
            store.dispatch({
                type: "SET_CITY",
                payload: {
                  city:{
                      name: response.name
                  }
                }
              });
            this.labelTemp.text = Math.round(response.main.temp).toString();
            this.changeBackgroudByWeather(response.weather[0].main)
            this.toggleIndicatorVisibility(false);

        }
        else {
            this.toggleIndicatorVisibility(false);
        }

    }

    async getCurrentLocation() {
        Location.start(Location.Android.Priority.HIGH_ACCURACY, 1000);
        const loc = await getLocation();
        if (loc) {
            const response = await getWeatherByLocation(loc.latitude, loc.longitude);
            if (response) {
                console.log('weather response', response);
                this.labelWeatherStatus.text = response.weather[0].description
                this.labelWindspeed.text = response.wind.speed
                this.labelHumidity.text = `${response.main.humidity}%`
                this.latitude = response.coord.lat;
                this.longitude = response.coord.lat;
                this.city = response.name;
                this.imageView1.loadFromUrl({
                    url: `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`,
                })
                this.labelCity.text = response.name;
                store.dispatch({
                    type: "SET_CITY",
                    payload: {
                      city:{
                          name: response.name
                      }
                    }
                  });
                this.labelTemp.text = Math.round(response.main.temp).toString();
                this.changeBackgroudByWeather(response.weather[0].main)
                this.toggleIndicatorVisibility(false);
            } else {
                this.toggleIndicatorVisibility(false);
            }
        }
    }
    toggleIndicatorVisibility(toggle: boolean) {
        this.activityIndicator1.dispatch({
            type: 'updateUserStyle',
            userStyle: {
                visible: toggle
            }
        });
    }
    changeBackgroudByWeather(weatherType: string) {
        switch (weatherType) {
            case 'Clouds':
                this.layout.backgroundColor = Color.createGradient({
                    startColor: Color.create('#429f98'),
                    endColor: Color.create('#70f3e9'),
                    direction: Color.GradientDirection.VERTICAL
                })
                break;
            case 'Clear':
                this.layout.backgroundColor = Color.createGradient({
                    startColor: Color.create('#fccf85'),
                    endColor: Color.create('#f9eddc'),
                    direction: Color.GradientDirection.VERTICAL
                })
                break;
            case 'Rain':
            case 'Thunderstorm':
                this.layout.backgroundColor = Color.createGradient({
                    startColor: Color.create('#20414b'),
                    endColor: Color.create('#5ad4fb'),
                    direction: Color.GradientDirection.VERTICAL
                })
                break;
            case 'Snow':
                this.layout.backgroundColor = Color.createGradient({
                    startColor: Color.create('#9addf2'),
                    endColor: Color.create('#fcfcfc'),
                    direction: Color.GradientDirection.VERTICAL
                })
                break;
            default:
                break;
        }
    }
    initWeatherAlerts() {
        try {
            this.gridView1.itemCount = sliderItems.length;
            this.gridView1.scrollBarEnabled = false;
            this.gridView1.onItemBind = (GridViewItem: SliderItem, index: number) => {
                console.log('bind here',sliderItems)
                
                GridViewItem.backgroundColor = Color.createGradient({
                    startColor: Color.create('#70f3e9'),
                    endColor: Color.create('#429f98'),
                    direction: Color.GradientDirection.VERTICAL
                })
                GridViewItem.lblSliderTitle.text = sliderItems[index].title;
                GridViewItem.lblSliderSubTitle.text = sliderItems[index].subTitle;
            }
        } catch (error) {
            console.log('error', error)
        }
    }
}


/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 */
function onShow(this: Page1, superOnShow: () => void) {
    superOnShow();
    this.headerBar.titleLayout.applyLayout();
    if (store.getState().city.name && store.getState().city.name !== '') {
        this.getWeather(store.getState().city.name);
    }

}

/**
 * @event onLoad
 * This event is called once when page is created.
 */
function onLoad(this: Page1, superOnLoad: () => void) {
    superOnLoad();
    this.initWeatherAlerts();
    if (store.getState().city.name && store.getState().city.name !== '') {
        this.getWeather(store.getState().city.name);
    } else {
        Location.android.checkSettings({
            onSuccess: () => {
                PermissionUtil.getPermission({ androidPermission: Application.Android.Permissions.ACCESS_FINE_LOCATION, permissionText: 'Please go to the settings and grant permission' })
                    .then(() => {
                        this.getCurrentLocation();
                    })
                    .then((reason) => {
                        console.info('Permission rejected');
                    });
            },
            onFailure: (e: { statusCode: Location.Android.SettingsStatusCodes }) => {
                console.log('Location.checkSettings onFailure');
                if (e.statusCode == Location.Android.SettingsStatusCodes.DENIED) {
                    console.log('SettingsStatusCodes.DENIED');
                } else {
                    // go to settings via Application.call
                    console.log('SettingsStatusCodes.OTHER' + Location.Android.SettingsStatusCodes.OTHER);
                }
            }
        });
        if (System.OS === 'iOS') {
            this.getCurrentLocation();
        } else {
            this.getCurrentLocation();

        }
    }

    this.headerBar.leftItemEnabled = false;
    this.headerBar.titleLayout = new PageTitleLayout();
    componentContextPatch(this.headerBar.titleLayout, 'titleLayout');
    if (System.OS === 'Android') {
        this.headerBar.title = '';
    }
}

