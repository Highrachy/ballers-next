import Header from '@/components/layout/Header';
import { FaInfoCircle } from 'react-icons/fa';
import { useState } from 'react';
import OptionCard from './OptionCard';
import QuestionPageNavigation from '../shared/Navigation';

const question = {
  id: 1,
  title: 'What is your current housing situation?',
  description: 'Choose your current status. No judgment, just direction.',
  options: [
    {
      id: 'rent',
      title: 'I rent my home',
      subtitle: 'I pay monthly or yearly rent',
      emoji: '/img/game/options/1-rent.svg',
    },
    {
      id: 'own',
      title: 'I own my home',
      subtitle: 'I own it fully or paying mortgage',
      emoji: '/img/game/options/1-rent.svg',
    },
    {
      id: 'family',
      title: 'I live with friends/family',
      subtitle: 'Staying without paying rent',
      emoji: '/img/game/options/1-rent.svg',
    },
  ],
};

export default function QuestionPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="question-page">
      <div className="question-content">
        <Header />

        <section className="question-main container">
          <div className="question-top">
            <div className="question-index small fw-bold text-uppercase">
              Question <span className="fw-bolder">{question.id} of 12</span>{' '}
              <FaInfoCircle className="ms-1 text-muted" size="0.8em" />
            </div>
            <h2 className="question-title mt-2">{question.title}</h2>
            <p className="question-subtext">{question.description}</p>
          </div>

          <div className="option-grid">
            {question.options.map((opt, index) => (
              <OptionCard
                key={opt.id}
                {...opt}
                selected={selected === index}
                onClick={() => setSelected(index)}
              />
            ))}
          </div>

          <QuestionPageNavigation
            onPrevious={() => console.log('Go back')}
            onNext={() => console.log('Go next')}
            isFirst={question.id === 1}
            isLast={question.id === 12}
          />
        </section>
      </div>
    </div>
  );
}
