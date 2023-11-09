import { PROPERTY_DELIVERY_STATE } from './constants';

const DEFAULT_MILESTONES = {
  initiation: {
    key: 'initiation',
    title: 'Initiation',
    description: 'Documentation, preliminaries, and foundation',
    percentage: 50, // Fixed at 50
    editable: false,
  },
  carcass: {
    key: 'carcass',
    title: 'Carcass',
    description: 'Frames, walls, roof, and M&E first fix',
    editable: true,
  },
  shell: {
    key: 'shell',
    title: 'Shell',
    description: 'Windows, doors, ironmongery, external building finishes',
    editable: true,
  },
  internalWorks: {
    key: 'internal',
    title: 'Internal finishes and decorations',
    description:
      'Floor, wall, and ceiling finishes, M&E installations, fixtures, fittings, painting, and decorations',
    editable: true,
  },
  externalWorks: {
    key: 'external',
    title: 'External works',
    description:
      'External walls, gates, driveway, parking, ancillary buildings, and external services',
    editable: true,
  },
  final: {
    key: 'final',
    title: 'Final Finishes',
    description: 'Testing, commissioning, and handover',
    percentage: 10,
    editable: false,
  },
};

export const generateDefaultMilestones = (
  propertyDeliveryState = PROPERTY_DELIVERY_STATE.Shell
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
  return milestones;
};
