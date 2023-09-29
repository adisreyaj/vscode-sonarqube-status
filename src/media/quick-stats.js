(() => {
  const vscode = acquireVsCodeApi();
  const previousState = vscode.getState();
  const measuresContainer = document.getElementById('measures-container');
  const qualityGateContainer = document.getElementById('quality-gate-container');
  if (previousState?.payload) {
    measuresContainer.innerHTML = createCards(previousState?.payload?.measures);
    qualityGateContainer.innerHTML = getStatus(previousState?.payload?.qualityGate?.value);
  }
  window.addEventListener('message', (event) => {
    const payload = event.data.payload;
    const type = event.data.type;
    switch (type) {
      case 'updateMeasures':
        vscode.setState({ payload });
        measuresContainer.innerHTML = createCards(payload.measures);
        qualityGateContainer.innerHTML = getStatus(payload.qualityGate?.value);
        break;
    }
  });

  function createCards(data) {
    return `
      <section class="quick-stats">
      <ul class="quick-stats__list">
        ${data
          .map((item) => {
            return createCard(item);
          })
          .join(' ')}
      </ul>
    </section>
    `;
  }

  function createCard(card) {
    return `
      <li class="quick-stats__list-item">
      <a href="${card.url}">
        <header>
          <p class="item__value">${card.value}</p>
        </header>
      </a>
        <footer>
          <p class="item__label">${card.label}</p>
        </footer>
      </li>
    `;
  }

  function getStatus(status) {
    switch (status) {
      case 'ERROR':
        return `
          <div class="quality-gate__badge quality-gate__fail">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-11.414L9.172 7.757 7.757 9.172 10.586 12l-2.829 2.828 1.415 1.415L12 13.414l2.828 2.829 1.415-1.415L13.414 12l2.829-2.828-1.415-1.415L12 10.586z"/>
            </svg>
            <p>Failed</p>
          </div>`;
      default:
        return `
          <div class="quality-gate__badge quality-gate__pass">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6 7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
            </svg>
            <p>Passed</p>
          </div>
          `;
    }
  }
})();
