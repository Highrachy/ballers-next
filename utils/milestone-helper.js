import { addMonths, format, isValid, parseISO } from 'date-fns';
import { PRICING_MODEL, PROPERTY_DELIVERY_STATE } from './constants';
import { property, update } from 'lodash';
import { getTinyDate } from './date-helpers';

const DEFAULT_MILESTONES = {
  initiation: {
    key: 'initiation',
    title: 'Initiation',
    description: 'Documentation, preliminaries, and foundation',
    percentage: 50, // Fixed at 50
    duration: 3,
    editable: false,
  },
  carcass: {
    key: 'carcass',
    title: 'Carcass',
    description: 'Frames, walls, roof, and M&E first fix',
    duration: 3,
    editable: true,
  },
  shell: {
    key: 'shell',
    title: 'Shell',
    description: 'Windows, doors, ironmongery, external building finishes',
    duration: 3,
    editable: true,
  },
  internalWorks: {
    key: 'internal',
    title: 'Internal finishes and decorations',
    description:
      'Floor, wall, and ceiling finishes, M&E installations, fixtures, fittings, painting, and decorations',
    duration: 3,
    editable: true,
  },
  externalWorks: {
    key: 'external',
    title: 'External works',
    description:
      'External walls, gates, driveway, parking, ancillary buildings, and external services',
    duration: 3,
    editable: true,
  },
  final: {
    key: 'final',
    title: 'Final Finishes',
    description: 'Testing, commissioning, and handover',
    duration: 3,
    percentage: 10,
    editable: false,
  },
};

export const generateDefaultMilestones = (
  propertyDeliveryState = PROPERTY_DELIVERY_STATE.Shell,
  projectStartDate = new Date()
) => {
  const milestones = [DEFAULT_MILESTONES.initiation];

  switch (propertyDeliveryState) {
    case PROPERTY_DELIVERY_STATE.Carcass:
      DEFAULT_MILESTONES.carcass.percentage = 40;
      milestones.push(DEFAULT_MILESTONES.carcass);
      break;

    case PROPERTY_DELIVERY_STATE.Shell:
      DEFAULT_MILESTONES.shell.percentage = 20;
      DEFAULT_MILESTONES.carcass.percentage = 20;
      milestones.push(DEFAULT_MILESTONES.carcass, DEFAULT_MILESTONES.shell);
      break;

    case PROPERTY_DELIVERY_STATE.Completed:
      DEFAULT_MILESTONES.shell.percentage = 15;
      DEFAULT_MILESTONES.carcass.percentage = 15;
      DEFAULT_MILESTONES.externalWorks.percentage = 10;
      milestones.push(
        DEFAULT_MILESTONES.carcass,
        DEFAULT_MILESTONES.shell,
        DEFAULT_MILESTONES.externalWorks
      );
      break;

    case PROPERTY_DELIVERY_STATE.Furnished:
      DEFAULT_MILESTONES.shell.percentage = 10;
      DEFAULT_MILESTONES.carcass.percentage = 10;
      DEFAULT_MILESTONES.internalWorks.percentage = 10;
      DEFAULT_MILESTONES.externalWorks.percentage = 10;
      milestones.push(
        DEFAULT_MILESTONES.carcass,
        DEFAULT_MILESTONES.shell,
        DEFAULT_MILESTONES.internalWorks,
        DEFAULT_MILESTONES.externalWorks
      );
      break;

    default:
      break;
  }

  milestones.push(DEFAULT_MILESTONES.final);
  return generateMilestoneDueDates(milestones, projectStartDate);
};

export const getTotalMilestoneDuration = (milestones) => {
  let totalDuration = 0;

  for (const milestoneKey in milestones) {
    if (milestones.hasOwnProperty(milestoneKey)) {
      totalDuration += milestones[milestoneKey].duration;
    }
  }

  return totalDuration;
};

export const generateMilestoneDueDates = (milestones, projectStartDate) => {
  if (!projectStartDate || !isValid(parseISO(projectStartDate))) {
    throw new Error('Invalid project start date');
  }

  let currentDate = parseISO(projectStartDate);
  const updatedMilestones = milestones.map((milestone) => {
    const dueDate = addMonths(currentDate, milestone.duration);
    milestone.dueDate = format(dueDate, 'yyyy-MM-dd');
    currentDate = dueDate;
    return milestone;
  });

  return updatedMilestones;
};

export const getLastMilestoneDueDate = (milestones) => {
  if (milestones.length === 0) {
    return null;
  }

  const lastDueDate = milestones[milestones.length - 1].dueDate;

  if (isValid(parseISO(lastDueDate))) {
    return getTinyDate(lastDueDate);
  }

  return null;
};

export const isMilestonePayment = (property) =>
  property?.pricingModel === PRICING_MODEL.Milestone;
