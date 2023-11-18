import { addMonths, format, isValid, parseISO } from 'date-fns';
import { PRICING_MODEL, PROPERTY_DELIVERY_STATE } from './constants';
import { getTinyDate } from './date-helpers';

export const DEFAULT_MILESTONES = {
  initiation: {
    key: 'initiation',
    title: 'Initiation2',
    description:
      'This phase involves the foundational steps and preliminary documentation essential to kickstart the project. It covers initial paperwork, site evaluations, and establishing the project groundwork.',
    percentage: 50, // Fixed at 50
    duration: 3,
    editable: false,
  },
  carcass: {
    key: 'carcass',
    title: 'Carcass',
    description:
      'The Carcass stage focuses on constructing the basic structure of the property, including the framing, walls, roof, and initial mechanical and electrical fittings. It sets the structural framework for subsequent phases.',
    duration: 3,
    editable: true,
  },
  shell: {
    key: 'shell',
    title: 'Shell',
    description:
      'During the Shell phase, the emphasis is on installing windows, doors, ironmongery, and external building finishes. This stage ensures the property becomes weatherproof and secure.',
    duration: 3,
    editable: true,
  },
  internalWorks: {
    key: 'internal',
    title: 'Internal finishes and decorations',
    description:
      'The Internal Works phase covers interior elements such as floor, wall, and ceiling finishes, along with comprehensive mechanical and electrical installations, fixtures, fittings, painting, and aesthetic enhancements.',
    duration: 3,
    editable: true,
  },
  externalWorks: {
    key: 'external',
    title: 'External works',
    description:
      'External Works include finalizing external walls, gates, driveway construction, parking, and integrating auxiliary structures and services to complete the property’s exterior elements.',
    duration: 3,
    editable: true,
  },
  final: {
    key: 'final',
    title: 'Final Finishes',
    description:
      "This concluding phase involves meticulous testing, commissioning, and the ultimate handover. It's the stage where the property undergoes comprehensive checks and gets prepared for the final handover to the client.",
    percentage: 10,
    duration: 3,
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
    const updatedMilestone = {
      _id: milestone._id,
      key: milestone.key,
      title: milestone.title,
      description: milestone.description,
      dueDate: format(dueDate, 'yyyy-MM-dd'),
      duration: milestone.duration,
      percentage: milestone.percentage,
      editable: milestone.editable,
    };
    currentDate = dueDate;
    return updatedMilestone;
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
