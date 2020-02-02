import React from 'react';
import Link from 'next/link';
import Head from '../components/head';
import {
  Container,
  Card,
  CardContent,
  Switch,
  LinearProgress,
  Slider,
  Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const style = {
  card: {
    minWidth: 275,
    padding: 20
  }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getChord() {
  const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const modifiers = ['#', 'b', ''];
  const types = ['Maj', 'Maj7', 'min', 'min7', 'dim', 'dim7', '6'];
  return {
    note: notes[getRandomInt(0, notes.length - 1)],
    mod: modifiers[getRandomInt(0, modifiers.length - 1)],
    type: types[getRandomInt(0, types.length - 1)]
  };
}

const IOSSwitch = withStyles(theme => ({
  root: {
    width: 252,
    height: 76,
    padding: 0,
    margin: theme.spacing(3)
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(178px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#556cd6',
        opacity: 1,
        border: 'none'
      }
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '18px solid #fff'
    }
  },
  thumb: {
    width: 72,
    height: 72
  },
  track: {
    borderRadius: 78 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border'])
  },
  checked: {},
  focusVisible: {}
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked
      }}
      {...props}
    />
  );
});

class Home extends React.Component {
  scheduler = null;
  state = {
    running: false,
    chord: getChord(),
    duration: 3,
    progress: 0
  };

  toggle = () => {
    if (this.state.running) {
      clearInterval(this.scheduler);
      this.setState({ progress: 0 });
    } else {
      this.setState({ chord: getChord() });
      this.scheduler = setInterval(() => {
        if (this.state.progress >= this.state.duration) {
          this.setState({ progress: 1, chord: getChord() });
        } else {
          this.setState({ progress: this.state.progress + 1 });
        }
      }, 1000);
    }

    this.setState({ running: !this.state.running });
  };

  showChord = () => {
    const { chord } = this.state;
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
  };

  render() {
    const chord = this.showChord();
    return (
      <Container fixed>
        <Head title="chord workshop" />
        <Card style={style.card}>
          <div className="controller">
            <IOSSwitch
              checked={this.state.running}
              onChange={this.toggle}
              value="checkedA"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
            <Typography id="non-linear-slider" gutterBottom>
              <span className="duration-text">
                Change chord every{' '}
                <span className="red">{this.state.duration} </span>
                seconds
              </span>
            </Typography>
            <Slider
              defaultValue={3}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              onChange={(e, value) => {
                this.setState({ duration: value });
              }}
              step={1}
              marks
              min={1}
              max={10}
            />
          </div>
        </Card>
        <br />
        <LinearProgress
          variant="determinate"
          value={(this.state.progress / this.state.duration) * 100}
        />
        <Card style={style.card}>
          <CardContent>{chord}</CardContent>
        </Card>

        <style jsx>{`
          .title {
            margin: 0;
            width: 100%;
            padding-top: 80px;
            line-height: 1.15;
            font-size: 48px;
          }
          .title,
          .description {
            text-align: center;
          }
          .controller {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 50px;
          }
          .duration-text {
            font-size: 20px;
          }
          .red {
            color: red;
            font-weight: 600;
          }
        `}</style>
      </Container>
    );
  }
}
export default Home;
