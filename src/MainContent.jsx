import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import PrayerCard from './PrayerCard';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import moment from "moment";

export default function MainContent() {

  // قائمة المدن المتاحة
  const Cities = [
    { name: "القاهرة", api: "Cairo" },
    { name: "الإسكندرية", api: "Alexandria" },
    { name: "الجيزة", api: "Giza" },
    { name: "القليوبية", api: "Qalyubia" },
    { name: "بورسعيد", api: "Port Said" },
    { name: "السويس", api: "Suez" },
    { name: "الدقهلية", api: "Dakahlia" },
    { name: "الشرقية", api: "Sharqia" },
    { name: "كفر الشيخ", api: "Kafr El Sheikh" },
    { name: "الغربية", api: "Gharbia" },
    { name: "المنوفية", api: "Monufia" },
    { name: "البحيرة", api: "Beheira" },
    { name: "الإسماعيلية", api: "Ismailia" },
    { name: "بني سويف", api: "Beni Suef" },
    { name: "الفيوم", api: "Faiyum" },
    { name: "المنيا", api: "Minya" },
    { name: "أسيوط", api: "Asyut" },
    { name: "سوهاج", api: "Sohag" },
    { name: "قنا", api: "Qena" },
    { name: "الأقصر", api: "Luxor" },
    { name: "أسوان", api: "Aswan" },
    { name: "البحر الأحمر", api: "Red Sea" },
    { name: "الوادي الجديد", api: "New Valley" },
    { name: "مطروح", api: "Matrouh" },
    { name: "شمال سيناء", api: "North Sinai" },
    { name: "جنوب سيناء", api: "South Sinai" }
  ];

  // المدينة المختارة
  const [city, setCity] = useState({ name:"القاهرة", api:"Cairo" })

  // أوقات الصلاة
  const [timings, setTimings] = useState({
    Fajr:"04:00",
    Dhuhr:"12:55",
    Asr:"04:35",
    Maghrib:"07:45",
    Isha:"08:45"
  })

  // أسماء الصلوات
  const prayers = [
    { prayerName:"الفجر", prayerApi:"Fajr" },
    { prayerName:"الظهر", prayerApi:"Dhuhr" },
    { prayerName:"العصر", prayerApi:"Asr" },
    { prayerName:"المغرب", prayerApi:"Maghrib" },
    { prayerName:"العشاء", prayerApi:"Isha" },
  ]

  // الصلاة القادمة
  const [prayersList,setPrayersList] = useState({})

  // التاريخ اليومي
  const [today, setToday] = useState("")

  // الوقت المتبقي
  const [remainingTime, setRemainingTime] = useState("00 : 00 : 0")

  // تغيير المدينة المختارة
  const handleCityChange = (event) => {
    const selectedCity = Cities.find((city) => city.api == event.target.value);
    setCity(selectedCity)
  };

  // قائمة المدن داخل القائمة
  const citiesList= Cities.map((c) => (
    <MenuItem style={{color:"white", fontSize:"25px"}} value={c.api}>{c.name}</MenuItem>
  ))

  // API
  const fetchPrayerTimes = async (city) => {
    try {
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?country=EG&city=${city}`
      );
      setTimings(response.data.data.timings);
    } catch (err) {
      console.error("Error fetching prayer times:", err);
    }
  };

  // useEffect تحديث التوقيت عند تغيير المدينة
  useEffect(() => {
    fetchPrayerTimes(city.api);
    const t = moment();
    setToday(t.format("L"))
  }, [city]);

  // useEffect تحديث العد التنازلي
  useEffect(() => {
      let interval = setInterval(() => {
      handleNextPrayer()
    }, 1000);

    return () => clearInterval(interval)
  },[timings])

  // دالة حساب الصلاة القادمة والوقت المتبقي
  const handleNextPrayer = () => {
    console.log("hello from next prayer function")

    const momentNow = moment();
    let nextPrayer = 0;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ){ nextPrayer=1; }

    else if(
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ){ nextPrayer=2; }

    else if(
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ){ nextPrayer=3; }

    else if(
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ){ nextPrayer=4; }

    else{ nextPrayer=0; }

    setPrayersList(prayers[nextPrayer])

    // حساب الوقت المتبقي للصلاة القادمة
    const nextPrayerObject = prayers[nextPrayer];
    const nextPrayerTime = timings[nextPrayerObject.prayerApi];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(moment("00:00:00", "hh:mm:ss"));
      remainingTime = midnightDiff + fajrToMidnightDiff;
    }

    const durationRemainingTime = moment.duration(remainingTime);

    setRemainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
  }

  // واجهة العرض
  return (
    <>
      {/* التاريخ والمدينة والعد التنازلي */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12, lg: 6 }}>
          <div style={{ textAlign: "center" }}>
            <h3>{today}</h3>
            <h2 style={{fontSize:"35px"}}>{city.name}</h2>
          </div>
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 6 }}>
          <div style={{ textAlign: "center" }}>
            <h3>{remainingTime}</h3>
            <h2 style={{fontSize:"35px"}}>متبقي حتى صلاة {prayersList.prayerName}</h2>
          </div>
        </Grid>
      </Grid>

      {/* فاصل */}
      <Divider variant="full" style={{borderColor:"white", opacity:"0.1"}}/>

      {/* كروت مواقيت الصلاة */}
      <Stack direction="row" justifyContent={"center"}  flexWrap={'wrap'} style={{marginTop:"40px"}}>
        <PrayerCard name="الفجر" time={timings.Fajr} image="/images/Fajr.webp"/>
        <PrayerCard name="الظهر" time={timings.Dhuhr} image="/images/Dhuhr.webp"/>
        <PrayerCard name="العصر" time={timings.Asr} image="/images/Asr.webp"/>
        <PrayerCard name="المغرب" time={timings.Maghrib} image="/images/Maghrib.webp"/>
        <PrayerCard name="العشاء" time={timings.Isha} image="/images/Isha.webp"/>
      </Stack>

      {/* اختيار المدينة */}
      <div style={{display:"flex",justifyContent:"center", alignItems:"center" ,marginTop:"50px", marginBottom:"20px"}}>
        <FormControl style={{ minWidth: "200px" }}>
          <InputLabel
            id="demo-simple-select-label"
            sx={{
              color: "black",
              fontSize: "25px",
              fontWeight: "600",
              letterSpacing: "1px",
              backgroundColor: "white",
              px: 2,
              borderRadius: "6px",
              "&.Mui-focused": { color: "black" },
            }}
          >
            المدينة
          </InputLabel>

          <Select
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "8px",
              fontSize: "16px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "gray" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "lightgray" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={city.api}
            onChange={handleCityChange}
            MenuProps={{
              PaperProps: {
                style: { backgroundColor: "#222", color: "white" },
              },
            }}
          >
            {citiesList}
          </Select>
        </FormControl>
      </div>
    </>
  )
}
