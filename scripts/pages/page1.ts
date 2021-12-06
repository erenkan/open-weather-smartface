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
import Label from '@smartface/native/ui/label';
export default class Page1 extends Page1Design {
    label1: Label;
    label2: Label;
    myImageView: ImageView;
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
            this.toggleIndicatorVisibility(true);
            console.log('api response ->', response);
            if (response) {
                console.log('loc weather response', response);
                this.label1.text = response.name
                this.label2.text = response.main.temp
                this.labelCity.text = response.name;
                this.labelTemp.text = response.main.temp;
                this.labelFeelsLike.text = response.main.feels_like;
                this.toggleIndicatorVisibility(false);
            }
            else {
                this.toggleIndicatorVisibility(false);
            }
            //   this.router.push('/pages/page2', { message: 'Hello World!' });
        };
        this.cityName.onActionButtonPress = this.btnNext.onPress;

    }



    async getCurrentLocation() {
        console.log('current location')
        Location.start(Location.Android.Priority.HIGH_ACCURACY, 1000);
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
    //@ts-ignore 
    this.myImage = Image.createFromFile("assets://weather/sunny.png")
    this.myImageView = new ImageView({
        image: this.myImage
    }) as StyleContextComponentType<ImageView>;;
    this.addChild(this.myImageView, "myImageView", ".sf-imageView", {
        left: 0,
        width: 300,
        height: 400
    });
    this.label1 = new Label({
        width: 150,
        text: "Label1",
    })
    this.label2 = new Label({
        width: 120,
        text: "Label2",


    })
    this.flexLayout1.addChild(this.label1, 'label1', ".sf-label")
    this.flexLayout1.addChild(this.label2, 'label2', ".sf-label")

    this.headerBar.leftItemEnabled = false;
    this.headerBar.titleLayout = new PageTitleLayout();
    componentContextPatch(this.headerBar.titleLayout, 'titleLayout');
    if (System.OS === 'Android') {
        this.headerBar.title = '';
    }
}
