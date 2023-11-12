import { add, parseISO } from 'date-fns';
import { PAYMENT_OPTION } from './constants';

const PAYMENT_BREAKDOWN_OPTIONS = PAYMENT_OPTION;

export const generateMilestonePayments = (offer, property) => {
  const { milestonePayment } = property;
  const {
    totalAmountPayable,
    propertySellingPrice,
    paymentBreakdown,
    initialPaymentDate,
  } = offer;
  const additionalCharges = totalAmountPayable - propertySellingPrice;
  const totalMilestone = milestonePayment.length;
  const paymentSchedule = [];

  milestonePayment.forEach((milestone, index) => {
    const { percentage, dueDate, title } = milestone;
    let milestoneAmount = (propertySellingPrice * percentage) / 100;

    switch (paymentBreakdown) {
      case PAYMENT_BREAKDOWN_OPTIONS.INITIAL_DEPOSIT:
        if (index === 0) {
          milestoneAmount += additionalCharges;
        }
        break;

      case PAYMENT_BREAKDOWN_OPTIONS.EVENLY_DISTRIBUTED:
        milestoneAmount += parseFloat(
          (additionalCharges / totalMilestone).toFixed(2)
        );
        break;

      case PAYMENT_BREAKDOWN_OPTIONS.FINAL_DEPOSIT:
        if (index === totalMilestone - 1) {
          milestoneAmount += additionalCharges;
        }
        break;

      default:
        break;
    }

    let currentPaymentDate;
    if (index === 0) {
      currentPaymentDate =
        initialPaymentDate < dueDate ? initialPaymentDate : dueDate;
    } else {
      currentPaymentDate = milestonePayment[index - 1].dueDate;
    }

    const currentPayment = {
      title,
      date: currentPaymentDate,
      amount: milestoneAmount,
    };

    paymentSchedule.push(currentPayment);
  });

  return paymentSchedule;
};

export const generatePaymentSchedules = (offer) => {
  const {
    totalAmountPayable,
    propertySellingPrice,
    paymentFrequency,
    initialPaymentDate,
    paymentBreakdown,
  } = offer;

  let { initialPayment, periodicPayment } = offer;

  const additionalCharges = totalAmountPayable - propertySellingPrice;
  const noOfPaymentsAfterInitial =
    (propertySellingPrice - initialPayment) / periodicPayment;
  const fractionPayment =
    (propertySellingPrice - initialPayment) % periodicPayment;
  let lastPayment = fractionPayment > 0 ? fractionPayment : periodicPayment;
  const amountToAdd = parseFloat(
    (additionalCharges / Math.round(noOfPaymentsAfterInitial + 1)).toFixed(2)
  );

  switch (paymentBreakdown) {
    case PAYMENT_BREAKDOWN_OPTIONS.INITIAL_DEPOSIT:
      initialPayment += additionalCharges;
      break;

    case PAYMENT_BREAKDOWN_OPTIONS.EVENLY_DISTRIBUTED:
      initialPayment += amountToAdd;
      periodicPayment += amountToAdd;
      lastPayment += amountToAdd;
      break;
    case PAYMENT_BREAKDOWN_OPTIONS.FINAL_DEPOSIT:
      lastPayment += additionalCharges;
      break;

    default:
      break;
  }
  const paymentDates = [
    { title: 'Payment 1', date: initialPaymentDate, amount: initialPayment },
  ];

  for (let i = 1; i <= noOfPaymentsAfterInitial; i += 1) {
    const paymentDate = add(parseISO(initialPaymentDate), {
      days: paymentFrequency * i,
    });
    console.log({ paymentDate });
    paymentDates.push({
      title: `Payment ${i + 1}`,
      date: paymentDate,
      amount:
        i === noOfPaymentsAfterInitial && fractionPayment === 0
          ? lastPayment
          : periodicPayment,
    });
  }

  if (fractionPayment > 0) {
    const paymentDate = add(paymentDates[paymentDates.length - 1].date, {
      days: paymentFrequency,
    });
    paymentDates.push({
      title: `Payment ${paymentDates.length + 1}`,
      date: paymentDate,
      amount: lastPayment,
    });
  }

  return paymentDates;
};
