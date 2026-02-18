document.addEventListener('DOMContentLoaded', () => {
    // --- Auth Check ---
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '/login.html';
        return;
    }
    document.querySelector('.team-info').textContent = `Team: ${user.team_name || 'Alpha Squad'}`;
    
    document.querySelector('.logout-btn').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });

    // --- Navbar Toggle ---
    const topNav = document.getElementById('top-nav');
    const navToggle = document.getElementById('toggle-nav');
    navToggle.addEventListener('click', () => {
        topNav.classList.toggle('hidden');
        const icon = navToggle.querySelector('i');
        if (topNav.classList.contains('hidden')) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
        // Resize canvas after transition
        setTimeout(() => {
            const konvaHolder = document.getElementById('konva-holder');
            if (konvaHolder && typeof stage !== 'undefined') {
                stage.width(konvaHolder.offsetWidth);
                stage.height(konvaHolder.offsetHeight);
                stage.batchDraw();
            }
        }, 350);
    });

    // --- Timer Logic ---
    let time = 18 * 60 + 45; // 18:45
    const timerElement = document.getElementById('timer');
    
    const updateTimer = () => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (time > 0) {
            time--;
        } else {
            clearInterval(timerInterval);
            alert("Time's up!");
        }
    };
    
    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();

    // --- Full Screen & Auto-Submit Logic ---
    const enforceFullScreen = () => {
        // Create an overlay to force full screen
        const overlay = document.createElement('div');
        overlay.id = 'fullscreen-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 9999;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            color: white; font-family: 'Outfit', sans-serif;
        `;
        overlay.innerHTML = `
            <h1>Admin Requires Full Screen</h1>
            <p>You must be in full screen mode to continue this challenge.</p>
            <p><strong>Warning:</strong> Exiting full screen will automatically submit your work!</p>
            <button id="enter-fullscreen-btn" style="
                margin-top: 20px; padding: 10px 20px; font-size: 1.2rem;
                background: #6c5ce7; color: white; border: none; border-radius: 8px; cursor: pointer;
            ">Enter Full Screen</button>
        `;
        document.body.appendChild(overlay);

        document.getElementById('enter-fullscreen-btn').addEventListener('click', () => {
            document.documentElement.requestFullscreen().catch((err) => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        });
    };

    // Check full screen state
    document.addEventListener('fullscreenchange', () => {
        const overlay = document.getElementById('fullscreen-overlay');
        
        if (document.fullscreenElement) {
            // In full screen
            if (overlay) overlay.style.display = 'none';
        } else {
            // Exited full screen
            // If they haven't logged in yet, maybe don't submit? 
            // Assume if they are on this page, they are logged in.
            
            // Only auto-submit if the overlay was previously hidden (meaning they were in full screen)
            if (overlay && overlay.style.display === 'none') {
                alert("You exited full screen! Your design is being auto-submitted.");
                // Trigger submit logic
                document.querySelector('.submit-btn').click();
                
                // Show overlay again or redirect
                overlay.style.display = 'flex';
                overlay.innerHTML = `<h1>Submitted!</h1><p>You exited full screen mode.</p>`;
            }
        }
    });

    // Call enforcement on load
    enforceFullScreen();

    // --- Konva Setup ---
    const konvaHolder = document.getElementById('konva-holder');
    
    // Initial size
    const stage = new Konva.Stage({
        container: 'konva-holder',
        width: konvaHolder.offsetWidth,
        height: konvaHolder.offsetHeight,
    });

    // --- Sidebar Toggle Logic ---
    const workspace = document.querySelector('.workspace');
    const leftToggle = document.getElementById('toggle-left');
    const leftPanel = document.getElementById('left-panel');

    const updateLayout = () => {
        // Wait for transition to end roughly, or just trigger resize
        setTimeout(() => {
            stage.width(konvaHolder.offsetWidth);
            stage.height(konvaHolder.offsetHeight);
            stage.batchDraw();
        }, 310); // slightly longer than css transition
    };

    leftToggle.addEventListener('click', () => {
        workspace.classList.toggle('no-left');
        if (workspace.classList.contains('no-left')) {
            leftToggle.querySelector('i').classList.remove('fa-chevron-left');
            leftToggle.querySelector('i').classList.add('fa-chevron-right');
        } else {
             leftToggle.querySelector('i').classList.add('fa-chevron-left');
             leftToggle.querySelector('i').classList.remove('fa-chevron-right');
        }
        updateLayout();
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // Transformer for resizing/rotating
    const tr = new Konva.Transformer();
    layer.add(tr);

    // Selection Logic
    stage.on('click tap', function (e) {
        // if click on empty area - remove all selections
        if (e.target === stage) {
            tr.nodes([]);
            return;
        }

        // do nothing if clicked NOT on our rectangles
        if (!e.target.hasName('object')) {
            return;
        }

        // select
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
            // if no key pressed and the node is not selected
            // select just one
            tr.nodes([e.target]);
        } else if (metaPressed && isSelected) {
            // if we pressed keys and node was selected
            // we need to remove it from selection:
            const nodes = tr.nodes().slice(); // use slice to have new copy of array
            // remove node from array
            nodes.splice(nodes.indexOf(e.target), 1);
            tr.nodes(nodes);
        } else if (metaPressed && !isSelected) {
            // add the node into selection
            const nodes = tr.nodes().concat([e.target]);
            tr.nodes(nodes);
        }
    });

    // --- Drag and Drop Logic ---
    let itemType = '';

    // Sidebar items
    const draggableItems = document.getElementById('draggable-items');
    draggableItems.addEventListener('dragstart', (e) => {
        itemType = e.target.closest('.element-card').dataset.type;
    });

    // Drop zone wrapper
    const container = stage.container();

    // allow drop
    container.addEventListener('dragover', (e) => {
        e.preventDefault(); 
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();

        // Get pointer position
        stage.setPointersPositions(e);
        const pointerPosition = stage.getPointerPosition();
        
        if (!pointerPosition) return;

        let newItem;

        if (itemType === 'rect') {
            // Navbar - Simplified to Grey Rectangle
            newItem = new Konva.Rect({
                x: pointerPosition.x,
                y: pointerPosition.y,
                width: 300,
                height: 50,
                fill: '#95a5a6', // Grey
                stroke: '#7f8c8d',
                strokeWidth: 2,
                cornerRadius: 5,
                draggable: true,
                name: 'object',
            });

        } else if (itemType === 'search') {
            // Search Bar - Check Unlock
            const searchEl = document.getElementById('search-element');
            
            // Check if still locked
            if (searchEl && searchEl.classList.contains('locked-el')) {
                // Show Custom Modal (NO alert/prompt — those exit full screen!)
                const modal = document.getElementById('unlock-modal');
                const answerInput = document.getElementById('quest-answer');
                const feedback = document.getElementById('modal-feedback');
                
                modal.style.display = 'flex';
                answerInput.value = '';
                feedback.textContent = '';
                feedback.className = 'modal-feedback';
                setTimeout(() => answerInput.focus(), 100);

                // Setup one-time listeners (clone to remove old ones)
                const submitBtn = document.getElementById('submit-answer');
                const closeBtn = document.getElementById('close-modal');

                const newSubmit = submitBtn.cloneNode(true);
                submitBtn.parentNode.replaceChild(newSubmit, submitBtn);
                
                const newClose = closeBtn.cloneNode(true);
                closeBtn.parentNode.replaceChild(newClose, closeBtn);

                // Close Logic
                newClose.addEventListener('click', () => {
                    modal.style.display = 'none';
                });

                // Submit Logic — NO alert() anywhere!
                newSubmit.addEventListener('click', () => {
                    const answer = answerInput.value;
                    if (answer && answer.toLowerCase().replace(/\s/g, '').includes("harghootmeswaghai")) {
                        // Success — update DOM feedback, no alert
                        feedback.textContent = '✅ Correct! Search Bar Unlocked. Drag it again!';
                        feedback.className = 'modal-feedback success';
                        searchEl.classList.remove('locked-el');
                        searchEl.classList.add('unlocked');
                        // Close modal after a short delay so user can read the message
                        setTimeout(() => { modal.style.display = 'none'; }, 1500);
                    } else {
                        // Wrong answer — update DOM feedback, no alert
                        feedback.textContent = '❌ Wrong answer! Hint: Har Ghoot...';
                        feedback.className = 'modal-feedback error';
                    }
                });

                return; // Stop creation for now. User must drag again.
            }

            // Create Search Bar Shape (Only makes it here if unlocked)
             const group = new Konva.Group({
                x: pointerPosition.x,
                y: pointerPosition.y,
                draggable: true,
                name: 'object',
            });

            const bg = new Konva.Rect({
                width: 250,
                height: 40,
                fill: '#fff',
                stroke: '#ccc',
                strokeWidth: 1,
                cornerRadius: 20,
            });

            const icon = new Konva.Circle({
                x: 20, y: 20, radius: 8, fill: '#aaa'
            });

            const text = new Konva.Text({
                x: 40, y: 15, text: 'Search...', fontSize: 14, fill: '#aaa', fontFamily: 'Outfit'
            });

            group.add(bg, icon, text);
            newItem = group;

        } else if (itemType === 'image') {
            // Image Card Composite
             const group = new Konva.Group({
                x: pointerPosition.x,
                y: pointerPosition.y,
                draggable: true,
                name: 'object',
            });

            const bg = new Konva.Rect({
                width: 200,
                height: 150,
                fill: '#fff',
                stroke: '#bdc3c7',
                strokeWidth: 1,
                cornerRadius: 8,
                shadowBlur: 5,
                shadowOpacity: 0.1
            });

            const imagePlaceholder = new Konva.Rect({
                x: 10, y: 10,
                width: 180, height: 100,
                fill: '#e0e0e0',
                cornerRadius: 4
            });
            
            const textLines = new Konva.Group({ x: 10, y: 120 });
            textLines.add(new Konva.Rect({ width: 100, height: 8, fill: '#bdc3c7', cornerRadius: 2 }));
            textLines.add(new Konva.Rect({ y: 15, width: 140, height: 8, fill: '#ecf0f1', cornerRadius: 2 }));

            group.add(bg, imagePlaceholder, textLines);
            newItem = group;

        } else if (itemType === 'text') {
            newItem = new Konva.Text({
                x: pointerPosition.x,
                y: pointerPosition.y,
                text: 'Double click to edit',
                fontSize: 20,
                fontFamily: 'Outfit',
                fill: '#333',
                draggable: true,
                name: 'object',
            });
            
            // Text editing logic could be added here (e.g., showing a textarea on dblclick)
            newItem.on('dblclick dbltap', () => {
                // simple prompt for now
                const input = prompt('Edit text:', newItem.text());
                if(input) {
                   newItem.text(input);
                   layer.batchDraw();
                }
            });
        }

        if (newItem) {
            layer.add(newItem);
            // Select the new item
            tr.nodes([newItem]);
            layer.batchDraw(); // Efficient draw
            // Save state for undo/redo (saveState is defined later but hoisted via function scope)
            if (typeof saveState === 'function') saveState();
        }
    });

    // --- Handle Window Resize ---
    window.addEventListener('resize', () => {
         const container = document.getElementById('konva-holder');
         stage.width(container.offsetWidth);
         stage.height(container.offsetHeight);
    });

    // --- Undo / Redo History ---
    const history = [];
    let historyStep = -1;

    const saveState = () => {
        // Remove any future states if we're in the middle of history
        history.splice(historyStep + 1);
        // Save current layer state as JSON
        history.push(layer.toJSON());
        historyStep++;
    };

    // Save initial empty state
    saveState();

    // Override: save state after every drop
    const originalDrop = null; // We'll hook into the existing drop logic

    const undo = () => {
        if (historyStep <= 0) return; // Nothing to undo
        historyStep--;
        const prevState = history[historyStep];
        
        // Clear current layer and rebuild
        layer.destroyChildren();
        const restoredLayer = Konva.Node.create(prevState);
        // Move children from restored to current layer
        restoredLayer.getChildren().forEach(child => {
            const clone = child.clone();
            layer.add(clone);
        });
        
        // Re-add transformer
        tr.nodes([]);
        layer.add(tr);
        layer.batchDraw();
    };

    const redo = () => {
        if (historyStep >= history.length - 1) return; // Nothing to redo
        historyStep++;
        const nextState = history[historyStep];
        
        layer.destroyChildren();
        const restoredLayer = Konva.Node.create(nextState);
        restoredLayer.getChildren().forEach(child => {
            const clone = child.clone();
            layer.add(clone);
        });
        
        tr.nodes([]);
        layer.add(tr);
        layer.batchDraw();
    };

    const deleteSelected = () => {
        const selectedNodes = tr.nodes();
        if (selectedNodes.length === 0) return;
        
        selectedNodes.forEach(node => node.destroy());
        tr.nodes([]);
        layer.batchDraw();
        saveState();
    };

    // Hook: Save state after adding new items
    // We need to patch the existing drop handler. Monkey-patch by wrapping batchDraw after drop.
    const origBatchDraw = layer.batchDraw.bind(layer);
    let shouldSaveOnDraw = false;

    // Button listeners
    document.getElementById('undo-btn').addEventListener('click', undo);
    document.getElementById('redo-btn').addEventListener('click', redo);
    document.getElementById('delete-btn').addEventListener('click', deleteSelected);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undo();
        } else if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            redo();
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            // Only delete if not typing in an input
            e.preventDefault();
            deleteSelected();
        }
    });

    // Save state when items are moved/transformed
    stage.on('dragend', (e) => {
        if (e.target !== stage) saveState();
    });
    stage.on('transformend', () => {
        saveState();
    });

    // --- Submit Button ---
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const designData = stage.toJSON();
            const userData = JSON.parse(localStorage.getItem('user'));
            
            fetch('/api/save-design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId: userData?.id,
                    username: userData?.username,
                    team_name: userData?.team_name,
                    designData: designData 
                })
            })
            .then(res => res.json())
            .then(data => {
                // Show success in a non-alert way (preserve fullscreen)
                submitBtn.textContent = '✅ Submitted!';
                submitBtn.style.background = 'linear-gradient(90deg, #2ecc71, #27ae60)';
                setTimeout(() => {
                    submitBtn.textContent = 'Submit Your Design';
                    submitBtn.style.background = '';
                }, 2000);
            })
            .catch(err => {
                console.error("Error saving design:", err);
                submitBtn.textContent = '❌ Error!';
                setTimeout(() => {
                    submitBtn.textContent = 'Submit Your Design';
                    submitBtn.style.background = '';
                }, 2000);
            });
        });
    }

});

