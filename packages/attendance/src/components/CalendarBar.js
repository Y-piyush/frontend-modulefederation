import moment from "moment";
import { Box, HStack, Text, useToast, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconByName, calendar } from "@shiksha/common-lib";

const FormatDate = ({ date, type }) => {
  if (type === "Month") {
    return moment(date[0]).format("MMMM Y");
  } else if (type === "Week") {
    return (
      moment(date[0]).format("D MMM") +
      " - " +
      moment(date[date.length - 1]).format("D MMM")
    );
  } else if (type === "Today") {
    return moment(date).format("D MMM, ddd, HH:MM");
  } else if (type === "Tomorrow") {
    return moment(date).format("D MMM, ddd");
  } else if (type === "Yesterday") {
    return moment(date).format("D MMM, ddd");
  } else {
    return moment(date).format("D MMMM, Y");
  }
};

export default function CalendarBar({ view, ...props }) {
  let CalendarBar = <></>;
  switch (view) {
    case "month":
    case "monthInDays":
      CalendarBar = <MonthWiesBar {...props} />;
      break;
    case "week":
      CalendarBar = <WeekWiesBar {...props} />;
      break;
    default:
      CalendarBar = <DayWiesBar {...props} />;
      break;
  }
  return CalendarBar;
}

export function DayWiesBar({
  activeColor,
  setActiveColor,
  page,
  setPage,
  _box,
}) {
  const [date, setDate] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    setDate(moment().add(page, "days"));
    if (setActiveColor) {
      setActiveColor(page === 0 ? "button.500" : "coolGray.500");
    }
  }, [page, setActiveColor]);

  return (
    <Display
      {...{
        activeColor,
        setActiveColor,
        page,
        setPage,
        _box,
      }}
    >
      <VStack>
        <Text fontWeight={600} fontSize="16px">
          {page === 0
            ? t("TODAY")
            : page === 1
            ? t("TOMORROW")
            : page === -1
            ? t("YESTERDAY")
            : moment(date).format("dddd")}
        </Text>
        <Text fontWeight={300} fontSize="10px">
          <FormatDate date={date} />
        </Text>
      </VStack>
    </Display>
  );
}

export function WeekWiesBar({
  activeColor,
  setActiveColor,
  page,
  setPage,
  _box,
  nextDisabled,
  previousDisabled,
  rightErrorText,
  leftErrorText,
}) {
  const [weekDays, setWeekDays] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setWeekDays(calendar(page, "week"));
    if (setActiveColor) {
      setActiveColor(page === 0 ? "button.500" : "coolGray.500");
    }
  }, [page, setActiveColor]);

  return (
    <Display
      {...{
        activeColor,
        setActiveColor,
        page,
        setPage,
        _box,
        nextDisabled,
        previousDisabled,
        rightErrorText,
        leftErrorText,
      }}
    >
      <VStack>
        <FormatDate date={weekDays} type="Week" />
        <Text fontSize="10" fontWeight="300">
          {t("THIS_WEEK")}
        </Text>
      </VStack>
    </Display>
  );
}

export function MonthWiesBar({
  activeColor,
  setActiveColor,
  page,
  setPage,
  _box,
  nextDisabled,
  previousDisabled,
  rightErrorText,
  leftErrorText,
}) {
  const [monthDays, setMonthDays] = useState([]);

  useEffect(() => {
    setMonthDays(calendar(page, "monthInDays"));
    if (setActiveColor) {
      setActiveColor(page === 0 ? "button.500" : "coolGray.500");
    }
  }, [page, setActiveColor]);

  return (
    <Display
      {...{
        activeColor,
        setActiveColor,
        page,
        setPage,
        _box,
        nextDisabled,
        previousDisabled,
        rightErrorText,
        leftErrorText,
      }}
    >
      <VStack>
        <FormatDate date={monthDays} type="Month" />
        {/* <Text fontSize="10" fontWeight="300">
          {t("THIS_MONTH")}
        </Text> */}
      </VStack>
    </Display>
  );
}

const Display = ({
  children,
  activeColor,
  page,
  setPage,
  nextDisabled,
  previousDisabled,
  rightErrorText,
  leftErrorText,
  _box,
}) => {
  const toast = useToast();
  return (
    <Box bg="white" p="1" {..._box}>
      <HStack justifyContent="space-between" alignItems="center" space={4}>
        <HStack space="4" alignItems="center">
          <IconByName
            size="sm"
            color={
              typeof previousDisabled === "undefined" ||
              previousDisabled === false
                ? activeColor
                  ? activeColor
                  : "button.500"
                : "gray.400"
            }
            name="ArrowLeftSLineIcon"
            onPress={(e) => {
              if (leftErrorText) {
                toast.show(leftErrorText);
              } else if (
                typeof previousDisabled === "undefined" ||
                previousDisabled === false
              ) {
                setPage(page - 1);
              }
            }}
          />
        </HStack>
        <HStack space="4" alignItems="center">
          <Text fontSize="md" bold>
            {children}
          </Text>
        </HStack>
        <HStack space="2">
          <IconByName
            size="sm"
            color={
              typeof nextDisabled === "undefined" || nextDisabled === false
                ? activeColor
                  ? activeColor
                  : "button.500"
                : "gray.400"
            }
            name="ArrowRightSLineIcon"
            onPress={(e) => {
              if (rightErrorText) {
                toast.show(rightErrorText);
              } else if (
                typeof nextDisabled === "undefined" ||
                nextDisabled === false
              ) {
                setPage(page + 1);
              }
            }}
          />
        </HStack>
      </HStack>
    </Box>
  );
};
