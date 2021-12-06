import Page1Design from 'generated/pages/page1';
import componentContextPatch from '@smartface/contx/lib/smartface/componentContextPatch';
import PageTitleLayout from 'components/PageTitleLayout';
import Application from '@smartface/native/application';
import System from '@smartface/native/device/system';
import Location from '@smartface/native/device/location';
import PermissionUtil from '@smartface/extension-utils/lib/permission';
import { getWeatherByCityName, getWeatherByLocation } from '../api/weatherRepository';
import { getLocation } from '@smartface/extension-utils/lib/location';
import Image from '@smartface/native/ui/image';
import ImageView from '@smartface/native/ui/imageview';
import FlexLayout from '@smartface/native/ui/flexlayout';

export default class Page1 extends Page1Design {
    myImageView: StyleContextComponentType<ImageView>;
    router: any;
    constructor() {
        super();
        // Overrides super.onShow method
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        // Overrides super.onLoad method
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        this.btnNext.onPress = async () => {
            console.log(this.cityName.text);
            const response = await getWeatherByCityName(this.cityName.text);
            console.log('api response ->', response);
            //   this.router.push('/pages/page2', { message: 'Hello World!' });
        };
        this.cityName.onActionButtonPress = this.btnNext.onPress;
    }



    async getCurrentLocation() {
        try {
            console.log('current location')
            // Location.start(Location.Android.Priority.HIGH_ACCURACY, 1000);
            const loc = await getLocation();
            console.log('location =>', loc);
            if (loc) {
                const response = await getWeatherByLocation(loc.latitude, loc.longitude);
                if (response) {
                    console.log('loc weather response', response);
                    this.labelCity.text = response.name;
                    this.labelTemp.text = response.main.temp;
                    this.labelFeelsLike.text = response.main.feels_like;
                    this.toggleIndicatorVisibility(false);
                } else {
                    this.toggleIndicatorVisibility(false);
                }
            }
            // getLocation = async (e) => {
            //   const response = await getWeatherByLocation(e.latitude, e.longitude);
            //   console.log('location response', response);
            // };
            // setTimeout(() => {
            //   Location.stop();
            // }, 500);
        }
        catch(e) {
            console.error(e);
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
}

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 */
function onShow(this: Page1, superOnShow: () => void) {
    superOnShow();
    this.headerBar.titleLayout.applyLayout();

    Location.android.checkSettings({
        onSuccess: () => {
            console.log('Location.checkSettings onSuccess');
            PermissionUtil.getPermission({androidPermission: Application.Android.Permissions.ACCESS_FINE_LOCATION, permissionText: 'Please go to the settings and grant permission' })
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

/**
 * @event onLoad
 * This event is called once when page is created.
 */
function onLoad(this: Page1, superOnLoad: () => void) {
    superOnLoad();
    //@ts-ignore - wrong usage
    this.myImage = Image.createFromFile("assets://weather/sunny.png")
    this.myImageView = new ImageView({
        image: this.myImage
    }) as StyleContextComponentType<ImageView>;
    this.addChild(this.myImageView, "myImageView", ".sf-imageView", {
        left: 0,
        width: 300,
        height: 400
    });
    this.headerBar.leftItemEnabled = false;
    this.headerBar.titleLayout = new PageTitleLayout();
    componentContextPatch(this.headerBar.titleLayout, 'titleLayout');
    if (System.OS === 'Android') {
        this.headerBar.title = '';
    }
}
