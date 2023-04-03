import { ICON_MAP } from "./iconMap";
import { getWeather } from "./weather";

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

function positionSuccess({ coords }: { coords: any }) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then(renderWeather)
    .catch((e) => {
      console.error(e);
      alert("Error getting weather.");
    });
}

function positionError() {
  alert(
    "There was an error getting your location. Please allow us to use your location and refresh the page."
  );
}

function renderWeather({
  current,
  daily,
  hourly,
}: {
  current: any;
  daily: any;
  hourly: any;
}) {
  console.log(current);
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  document.body.classList.remove("blurred");
}

function setValue(
  selector: string,
  value: any,
  { parent = document }: { parent?: Document | Node } = {}
) {
  (parent as Element).querySelector(`[data-${selector}]`)!.textContent = value;
}

function getIconUrl(iconCode: any) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

const currentIcon = document.querySelector(
  "[data-current-icon]"
) as HTMLImageElement;
function renderCurrentWeather(current: any) {
  currentIcon!.src = getIconUrl(current.iconCode);
  setValue("current-temp", current.currentTemp);
  setValue("current-high", current.highTemp);
  setValue("current-low", current.lowTemp);
  setValue("current-fl-high", current.highFeelsLike);
  setValue("current-fl-low", current.lowFeelsLike);
  setValue("current-wind", current.windSpeed);
  setValue("current-precip", current.precip);
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" });
const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById(
  "day-card-template"
) as HTMLTemplateElement;
function renderDailyWeather(daily: any[]) {
  dailySection!.innerHTML = "";
  daily.forEach(
    (day: {
      maxTemp: any;
      timestamp: number | Date | undefined;
      iconCode: any;
    }) => {
      let element = dayCardTemplate!.content.cloneNode(true) as HTMLElement;
      setValue("temp", day.maxTemp, { parent: element });
      setValue("date", DAY_FORMATTER.format(day.timestamp), {
        parent: element,
      });
      // @ts-ignore
      element.querySelector("[data-icon]")!.src = getIconUrl(day.iconCode);
      dailySection!.append(element);
    }
  );
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" });
const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById(
  "hour-row-template"
) as HTMLTemplateElement;
function renderHourlyWeather(hourly: any[]) {
  hourlySection!.innerHTML = "";
  hourly.forEach(
    (hour: {
      temp: any;
      feelsLike: any;
      windSpeed: any;
      precip: any;
      timestamp: number | Date | undefined;
      iconCode: any;
    }) => {
      let element = hourRowTemplate!.content.cloneNode(true);
      setValue("temp", hour.temp, { parent: element });
      setValue("fl-temp", hour.feelsLike, { parent: element });
      setValue("wind", hour.windSpeed, { parent: element });
      setValue("precip", hour.precip, { parent: element });
      setValue("day", DAY_FORMATTER.format(hour.timestamp), {
        parent: element,
      });
      setValue("time", HOUR_FORMATTER.format(hour.timestamp), {
        parent: element,
      });
      // @ts-ignore
      element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
      hourlySection!.append(element);
    }
  );
}
