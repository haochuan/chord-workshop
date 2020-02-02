import React from 'react';

const Display = props => {
    const { chord } = props;
    if (chord.note) {
      return (
        <p className="chord">
          <span className="note">{chord.note}</span>
          <span className="mod">{chord.mod}</span>
          <span className="type">{chord.type}</span>
          <style jsx>{`
            .chord {
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 50px;
            }
            .note {
              font-size: 80px;
              font-weight: 600;
            }
            .mod {
              margin-top: -40px;
              padding-right: 10px;
            }
            .type {
            }
          `}</style>
        </p>
      );
    } else {
      return (
        <p className="chord">
          <span className="message">
            You have to select at least one note :(
          </span>
          <style jsx>{`
            .chord {
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 50px;
            }
          `}</style>
        </p>
      );
    }

}

export default Display;
